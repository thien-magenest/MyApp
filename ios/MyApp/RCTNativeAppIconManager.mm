//
//  RCTNativeAppIconManager.mm
//  MyApp
//
//  Created by Magenest Mobile on 4/12/24.
//

#import "RCTNativeAppIconManager.h"

@implementation RCTNativeAppIconManager
RCT_EXPORT_MODULE(NativeAppIconManager)

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeAppIconManagerSpecJSI>(params);
}

- (void)changeTo:(NSString *)appIconId {
  // Map the string to the appropriate alternate icon name
  NSString *alternateIconName = nil;
  
  if ([appIconId isEqualToString:@"default"]) {
      alternateIconName = nil;  // Default app icon
  } else if ([appIconId isEqualToString:@"tree"]) {
      alternateIconName = @"AppIconTree";  // Alternate icon "AppIconTree"
  } else if ([appIconId isEqualToString:@"lavender"]) {
      alternateIconName = @"AppIconLavender";  // Alternate icon "AppIconLavender"
  }
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[UIApplication sharedApplication] setAlternateIconName:alternateIconName completionHandler:^(NSError * _Nullable error) {
      if (error) {
        NSLog(@"%@", [error description]);
      }
    }];
  });
}

@end
