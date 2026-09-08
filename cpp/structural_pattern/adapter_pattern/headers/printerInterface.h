#pragma once

#include <string>

// TARGET: the interface our code wants to use.
class PrinterI {
public:
  virtual void print(const std::string &message) = 0;
  virtual ~PrinterI() = default;
};
