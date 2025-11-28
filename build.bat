@echo off

@REM Ren "./index.html" "index2.html"
@REM Ren "./main.html" "index.html"

Start /B /Wait cmd /C npm run build

@REM Ren "./index.html" "main.html"
@REM Ren "./index2.html" "index.html"

xcopy /E /I "./src/fonts" "./dist/fonts"
xcopy /E /I "./src/scss" "./dist/scss"

xcopy /E /I "./src/icons" "./dist/icons"
xcopy /E /I "./src/imgs" "./dist/imgs"

xcopy /E /I "./src/videos" "./dist/videos"
xcopy /E /I /Y "./lang" "./dist/lang"

setlocal enabledelayedexpansion

set items=impressum policy gallery aboutUs contactFormular footer gofundme sponsoringRows sponsorings theCar whatIsStemracing sponsoringRows

for %%i in (%items%) do (
    xcopy /E /I /Y "./%%i/scss" "./dist/%%i/scss"
    xcopy /E /I /Y "./%%i/imgs" "./dist/%%i/imgs"
)

@REM xcopy /E /I /Y "./impressum" "./dist/impressum"
@REM xcopy /E /I /Y "./policy" "./dist/policy"
@REM xcopy /E /I /Y "./gallery" "./dist/gallery"

@REM xcopy /E /I /Y "./aboutUs" "./dist/aboutUs"
@REM xcopy /E /I /Y "./contactFormular" "./dist/contactFormular"
@REM xcopy /E /I /Y "./footer" "./dist/footer"
@REM xcopy /E /I /Y "./gofundme" "./dist/gofundme"
@REM xcopy /E /I /Y "./sponsoringRows" "./dist/sponsoringRows"
@REM xcopy /E /I /Y "./sponsorings" "./dist/sponsorings"
@REM xcopy /E /I /Y "./theCar" "./dist/theCar"
@REM xcopy /E /I /Y "./whatIsStemracing" "./dist/whatIsStemracing"

mkdir "./dist/src"

xcopy /E /I /Y "./sponsorings/sponsoringDocuments" "./dist/sponsorings/sponsoringDocuments"
xcopy /E /I /Y "./src/imgs/showImageFullScreen" "./dist/showImageFullScreen"
xcopy /E /I /Y "./gallery/ts" "./dist/gallery/ts"
xcopy /E /I /Y "./theCar/videos" "./dist/theCar/videos"
xcopy /E /I /Y "./src/fonts" "./dist/src/fonts"

cd ./gallery

copy "./galleryImagesWEB.json" "../dist/gallery/galleryImages.json"
copy "./galleryVideos.json" "../dist/gallery/galleryVideos.json"

cd ..


cd ./dist

@REM Ren "./index.html" "main.html"

cd ..

@REM copy "./index.html" "./dist/index.h"
cd ./src/imgs/countdown/
copy "./Digit.svg" "../../../dist/assets/Digit.svg"

cd ../../..

start python compile.py
start python resizeAllImages.py
start python convertToWebp.py

@REM cls
echo Alle Aufgaben erfolgreich abgeschlossen!