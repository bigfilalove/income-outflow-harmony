
@echo off
echo Starting build process...

:: Install dependencies
echo Installing dependencies...
call npm install

:: Build the project
echo Building project...
call npm run build

:: Create deployment package
echo Creating deployment package...
if not exist deployment mkdir deployment
xcopy /E /I dist deployment\dist
copy DEPLOYMENT.md deployment\
copy package.json deployment\

echo Build complete! Deployment package is ready in the 'deployment' directory.
echo Please refer to DEPLOYMENT.md for deployment instructions.
