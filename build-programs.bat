@echo off
echo Building Solana programs...
cd /d "P:\C.I.S\solana-realestate"

REM Set required environment variables
set HOME=%USERPROFILE%
set CARGO_HOME=%USERPROFILE%\.cargo
set RUSTUP_HOME=%USERPROFILE%\.rustup

echo.
echo Building property_tokenization...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\property_tokenization\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo Building rental_payment...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\rental_payment\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo Building mortgage_credit...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\mortgage_credit\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo Building rwa_collateral...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\rwa_collateral\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo Building property_diligence...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\property_diligence\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo Building loyalty_rewards...
"C:\Users\Slashy\.local\share\solana\install\releases\1.18.22\solana-release\bin\cargo-build-sbf.exe" --manifest-path="anchor\programs\loyalty_rewards\Cargo.toml" --sbf-out-dir="target\deploy"

echo.
echo All programs built successfully!
pause
