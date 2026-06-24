#import "DocumentScanner.h"
#import <VisionKit/VisionKit.h>
#import <React/RCTUtils.h>
#import <UIKit/UIKit.h>

@interface DocumentScanner () <VNDocumentCameraViewControllerDelegate>

@property (nonatomic, strong) RCTResponseSenderBlock callback;
@property (nonatomic, copy) NSDictionary *options;
@property (nonatomic, assign) BOOL hasReturnedResult; // ✅ prevent multiple calls

@end

@implementation DocumentScanner

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

#pragma mark - MAIN METHOD

RCT_EXPORT_METHOD(launchScanner:(NSDictionary *)options callback:(RCTResponseSenderBlock)callback)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        self.callback = callback;
        self.options = options;
        self.hasReturnedResult = NO;

        VNDocumentCameraViewController *scanner = [[VNDocumentCameraViewController alloc] init];
        scanner.delegate = self;

        UIViewController *root = RCTPresentedViewController();
        [root presentViewController:scanner animated:YES completion:nil];
    });
}

#pragma mark - SCANNER DELEGATE

- (void)documentCameraViewController:(VNDocumentCameraViewController *)controller
             didFinishWithScan:(VNDocumentCameraScan *)scan
{
    // 🚫 Prevent multiple callback calls
    if (self.hasReturnedResult) return;
    self.hasReturnedResult = YES;

    NSMutableArray *images = [NSMutableArray array];

    // ✅ ONLY FIRST IMAGE
    if ([scan pageCount] > 0) {
        UIImage *image = [scan imageOfPageAtIndex:0];
        [images addObject:[self processImage:image]];
    }

    // ✅ FORCE CLOSE SCANNER IMMEDIATELY
    dispatch_async(dispatch_get_main_queue(), ^{
        [controller dismissViewControllerAnimated:YES completion:^{
            if (self.callback) {
                self.callback(@[@{ @"images": images }]);
                self.callback = nil;
            }
        }];
    });
}

- (void)documentCameraViewControllerDidCancel:(VNDocumentCameraViewController *)controller
{
    if (self.hasReturnedResult) return;
    self.hasReturnedResult = YES;

    dispatch_async(dispatch_get_main_queue(), ^{
        [controller dismissViewControllerAnimated:YES completion:^{
            if (self.callback) {
                self.callback(@[@{ @"didCancel": @YES }]);
                self.callback = nil;
            }
        }];
    });
}

- (void)documentCameraViewController:(VNDocumentCameraViewController *)controller
                  didFailWithError:(NSError *)error
{
    if (self.hasReturnedResult) return;
    self.hasReturnedResult = YES;

    dispatch_async(dispatch_get_main_queue(), ^{
        [controller dismissViewControllerAnimated:YES completion:^{
            if (self.callback) {
                self.callback(@[@{
                    @"error": @YES,
                    @"errorMessage": error.localizedDescription ?: @"Scan failed"
                }]);
                self.callback = nil;
            }
        }];
    });
}

#pragma mark - IMAGE PROCESS

- (NSMutableDictionary *)processImage:(UIImage *)image
{
    float quality = self.options[@"quality"]
        ? [self.options[@"quality"] floatValue]
        : 1.0;

    NSData *data = UIImageJPEGRepresentation(image, quality);

    NSString *fileName = [[[NSUUID UUID] UUIDString] stringByAppendingString:@".jpg"];
    NSString *path = [NSTemporaryDirectory() stringByAppendingPathComponent:fileName];

    [data writeToFile:path atomically:YES];

    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    result[@"uri"] = [[NSURL fileURLWithPath:path] absoluteString];
    result[@"fileName"] = fileName;
    result[@"type"] = @"image/jpeg";
    result[@"width"] = @(image.size.width);
    result[@"height"] = @(image.size.height);
    result[@"fileSize"] = @(data.length);

    if ([self.options[@"includeBase64"] boolValue]) {
        result[@"base64"] = [data base64EncodedStringWithOptions:0];
    }

    return result;
}

@end