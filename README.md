Use only node v6.9.5

sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

cd /home/pi/ergTelemetryClient
sudo python cleanMain.py &
cd /home/pi/InteroPM5Emulator/
sudo node main.js &