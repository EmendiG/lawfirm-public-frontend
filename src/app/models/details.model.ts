export class Details
{
  fullName:string;
  phoneNumber:string;
  email:string;
  caseDescription:string;

  constructor(fullName:string, phoneNumber:string, email:string, caseDescription:string  ) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.caseDescription = caseDescription;
  }
}
