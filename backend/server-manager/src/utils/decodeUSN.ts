export default function decodeUSN(usn: string): number {
    if (!/^1MS/.test(usn)) throw new Error("Invalid USN format");
  
    const fourth = usn[3];
    const fifth = usn[4];
    const sixth = usn[5];
    const seventh = usn[6];
  
    if (/\d/.test(fourth) && /\d/.test(fifth)) {
      return 3;
    }
  
    if (fourth === "X" && !isNaN(Number(usn.slice(-5)))) {
      return 0;
    }
  
    if (sixth === "X" && seventh === "X") {
      return 1;
    }
  
    return 2;
  }
  