#include "../emailService.h"
#include <iostream>

using namespace std;

class AlertService : public EmailService {
public:
  void sendMail(string mail) { cout << "sending mail " << mail << endl; }
  string getMail() { return "Mail By Alert Service"; }
};
