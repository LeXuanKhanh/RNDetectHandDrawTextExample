
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNRnMlKitTextRecognitionSpec.h"

@interface RnMlKitTextRecognition : NSObject <NativeRnMlKitTextRecognitionSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RnMlKitTextRecognition : NSObject <RCTBridgeModule>
#endif

@end
