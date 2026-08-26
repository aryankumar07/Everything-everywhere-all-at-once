#include "./Factory/alertEmailFactory.cpp"
#include "./Factory/failedEmailFactory.cpp"
#include "./Factory/successEmailFactory.cpp"
#include "client.cpp"
#include "emailFactory.h"
#include "emailService.h"

int main() {
  EmailFactory *alertEmailFactory = new AlertEmailFactory();
  EmailFactory *failedEmailFactory = new FailedEmailFactory();
  EmailFactory *successEmailFactory = new SuccessEmailFactory();
  Client *newClient = new Client();
  newClient->setService(failedEmailFactory);
  EmailService *emailService = newClient->getService();
  string email = emailService->getMail();
  cout << email << endl;
  return 0;
}
