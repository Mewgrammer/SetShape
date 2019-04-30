$currentDirecotry = Get-Location;
$buildCommand = "ionic cordova build android --prod --release";
$signCommand = "jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore app.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name -storepass Mobilecompute";
$optimizeCommand = "C:\Users\Michael\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign.exe  -v -f 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/SetShape.apk";

# iex $buildCommand;
iex $signCommand;
iex $optimizeCommand;

Copy-Item -Path "platforms/android/app/build/outputs/apk/release/SetShape.apk" -Destination $currentDirecotry -Force;