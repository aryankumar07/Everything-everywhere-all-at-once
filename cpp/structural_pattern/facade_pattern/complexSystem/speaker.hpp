#pragma once

class Speaker {
private:
  int volume = 0;
  int prev = 0;

public:
  Speaker(int volume);
  void on();
  void off();
  void mute();
  void resume();
  void inc(int val);
  void dec(int val);
  void amplify(int val);
};
