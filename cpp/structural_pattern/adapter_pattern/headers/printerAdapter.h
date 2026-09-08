#pragma once

#include "legacyPrinter.h"
#include "printerInterface.h"

#include <string>

// ADAPTER: looks like a PrinterI, but does its work by calling LegacyPrinter.
class PrinterAdapter : public PrinterI {
public:
  PrinterAdapter(LegacyPrinter &printer) : legacyPrinter(printer) {}

  void print(const std::string &message) override;

private:
  LegacyPrinter &legacyPrinter; // the old printer we are wrapping
};
