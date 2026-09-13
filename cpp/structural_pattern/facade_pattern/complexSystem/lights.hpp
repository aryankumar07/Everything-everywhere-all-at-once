#pragma once

class Light {
private:
  int intensity = 1;

public:
  Light(int intensity);
  void on();
  void off();
  void inc(int val);
  void dec(int val);
};
