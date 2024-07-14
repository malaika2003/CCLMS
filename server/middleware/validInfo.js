 // Middleware function for validation
const validateCredentials = (req, res, next) => {
  const { email, name, password, divison, lobby, authority, designation} = req.body;

  // Function to validate email format
  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  };

    //   ^: Asserts the position at the start of the string.
    // \w+: Matches one or more word characters (letters, digits, and underscores).
    // ([.-]?\w+)*:
    // [.-]?: Matches an optional dot (.) or hyphen (-).
    // \w+: Matches one or more word characters.
    // ()*: The entire group can occur zero or more times.
    // @: Matches the @ symbol.
    // \w+: Matches one or more word characters (domain name).
    // ([.-]?\w+)*:
    // [.-]?: Matches an optional dot (.) or hyphen (-).
    // \w+: Matches one or more word characters.
    // ()*: The entire group can occur zero or more times.
    // (.\w{2,3})+:
    // .: Matches a literal dot (.).
    // \w{2,3}: Matches exactly 2 or 3 word characters (for example, com, net, org).
    // ()+: The entire group must occur one or more times.
    // $: Asserts the position at the end of the string.

  // Validation for registration route
  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, name, password, lobby, divison, authority, designation].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    }
    
  }
  // Validation for login route
  else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.json("Invalid Email");
    }
  }

  // Proceed to next middleware or route handler if validation passes
  next();
};


export default validateCredentials;