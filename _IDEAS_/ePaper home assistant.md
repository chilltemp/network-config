## Hardware I have

- WaveShare 264x176,2.7''e-paper/E-Ink display HAT for Raspberry Pi 2B/3B/Zero/Zero W,Three-color: red, black, white,SPI Interface, with 4 buttons left of screen
- Raspberry Pi Zero first gen

## The Idea

- display home assistant data on screen
- buttons toggle HA lights or run scripts

## First attempt

### Software

- DietPi OS
- Python
- WaveShare e-paper lib, compatible with python
- NodeRed

### Controls

- I used NodeRed on the Pi Zero to handle two-way communication with a NodeRed instance running as a Home Assistant addon.
- Button press triggers a local NodeRed input, which was sent to HA NodeRed. Where it would toggle lights, etc.
- One button was configured so that a long press would trigger a reboot
- HA NodeRed sent select light status and sensor values (temp) to local NodeRed. Local NodeRed would then run my custom Python script that would:
  1. generate a bitmap for the black e-paper layer
  2. generate a bitmap for the black e-paper layer
  3. send both bitmaps to the WaveShare lib for screen update. takes 30 seconds

## Problems

- frequent problems with communication to HA, requiring reboot
- freezes that required power resets
- 3 layers of abstraction from HS (HA NodeRed --> local NodeRed --> Python)
