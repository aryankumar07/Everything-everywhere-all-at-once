#pragma once

class PizzaI {
public:
  virtual void build() = 0;
  virtual int getCost() = 0;
};
