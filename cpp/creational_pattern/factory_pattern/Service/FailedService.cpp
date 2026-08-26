#include "../emailService.h"
#include <iostream>

using namespace std;

class FailedService : public EmailService {
public:
  void sendMail(string mail) { cout << "sending mail " << mail << endl; }
  string getMail() { return "Mail By Failed Service"; }
};
