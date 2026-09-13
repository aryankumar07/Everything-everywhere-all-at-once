#pragma once

#include "speaker.hpp"

class Amplifier {
private:
  Speaker *speaker;
  bool on;

public:
  Amplifier(Speaker *speaker);
  void toggle();
  void inc(int val);
};
