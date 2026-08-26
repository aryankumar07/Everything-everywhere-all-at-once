#include "../Service/SuccessService.cpp"
#include "../emailFactory.h"

class SuccessEmailFactory : public EmailFactory {
public:
  EmailService *createFactory() { return new SuccessService(); }
};
