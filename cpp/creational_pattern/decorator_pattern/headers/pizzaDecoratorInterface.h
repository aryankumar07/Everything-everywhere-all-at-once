#pragma once
#include "./pizzaInterface.h"

class PizzaDecorator : public PizzaI {
public:
  PizzaI *pizza;
  PizzaDecorator(PizzaI *pizza) { this->pizza = pizza; }
  virtual void build() = 0;
  virtual int getCost() = 0;
};
