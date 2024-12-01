#import "RnMlKitTextRecognition.h"
#import "rn_ml_kit_text_recognition-Swift.h"

@implementation RnMlKitTextRecognition
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  [RnMlKitTextRecognitionSwift multiplyWithA:a b:b resolve:resolve reject:reject];
  //    NSNumber *result = @(a * b);
  //
  //    resolve(result);
}

- (void)getTextFromPath:(NSString *)path resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject { 
  [RnMlKitTextRecognitionSwift getTextFromPath:path resolve:resolve reject:reject];
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRnMlKitTextRecognitionSpecJSI>(params);
}
#endif

@end
