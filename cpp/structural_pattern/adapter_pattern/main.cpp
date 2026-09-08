#include "headers/legacyPrinter.h"
#include "headers/printerAdapter.h"
#include "headers/printerInterface.h"

int main() {
  LegacyPrinter oldPrinter;              // the old object
  PrinterAdapter adapter(oldPrinter);    // wrap it

  PrinterI *printer = &adapter;          // use it through the new interface
  printer->print("This is a new message");

  return 0;
}
