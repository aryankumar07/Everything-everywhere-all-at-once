#pragma once

#include <iostream>
#include <string>
using namespace std;

class Logger {
public:
  static Logger &getInstance() {
    static Logger logger;
    return logger;
  }

  Logger(const Logger &) = delete;
  Logger &operator=(const Logger &) = delete;

  void log(const string &data) { cout << data << endl; }

private:
  Logger() { cout << "Logger instance invoked" << endl; }
};
