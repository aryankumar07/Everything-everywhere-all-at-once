#pragma once

#include "complexSystem/amplifier.hpp"
#include "complexSystem/lights.hpp"
#include "complexSystem/monitor.hpp"
#include "complexSystem/speaker.hpp"
#include "complexSystem/streaming.hpp"

class HomeTheaterFacade {
private:
  Amplifier *amplifier;
  Light *light;
  Monitor *monitor;
  Streaming *streaming;
  Speaker *speaker;

public:
  HomeTheaterFacade();
  ~HomeTheaterFacade();

  void watchMovie();
  void listenMusic();
  void stopMovie();
  void stopMusic();
  void incSound(int val);
  void decSound(int val);
  void mute();
  void resume();
  void toggleAmplifier();
  void amplifySound(int val);
};
