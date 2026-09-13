#include "monitor.hpp"
#include <iostream>

Monitor::Monitor() {}

void Monitor::on() { std::cout << "Started monitor" << std::endl; }
void Monitor::off() { std::cout << "Stopped monitor" << std::endl; }
