#include "headers/printerAdapter.h"

// This one line IS the adapter pattern:
// the new name (print) is translated into the old name (printMessage).
void PrinterAdapter::print(const std::string &message) {
  legacyPrinter.printMessage(message);
}
