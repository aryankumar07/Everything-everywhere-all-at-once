#pragma once
#include <string>
using namespace std;

class EmailService {
public:
  virtual void sendMail(string mail) = 0;
  virtual string getMail() = 0;
  virtual ~EmailService() = default;
};
