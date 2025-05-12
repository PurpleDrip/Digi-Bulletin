const getUserType = (key: string): string => {
    switch (key) {
      case "AS":
        return "ASSISTANT_PROFR";
      case "AP":
        return "ASSOCIATE_PROFR";
      case "PP":
        return "PROFR";
      case "HD":
        return "HOD";
      case "RR":
        return "REGISTRAR";
      case "CK":
        return "CLERKS";
      case "CR":
        return "COORDINATOR";
      case "PR":
        return "PRINCIPAL";
      case "DE":
        return "DEAN";
      case "DR":
        return "DIRECTOR";
      case "LB":
        return "LIBRARIAN";
      case "LA":
        return "LAB_ASSISTANT";
      case "SC":
        return "SECURITY_STAFF";
      case "JT":
        return "JANITORIAL_STAFF";
      case "TS":
        return "TRANSPORT_STAFF";
      case "CF":
        return "CAFETERIA_STAFF";
      case "LT":
        return "LAB_TECHNICIANS";
      case "IT":
        return "IT_STAFF";
      case "XG":
        return "GUEST";
      case "XA":
        return "ALUMINI";
      case "XX":
        return "ADMIN";
      default:
        return "UNKNOWN";
    }
  };
  
  export default getUserType;
  