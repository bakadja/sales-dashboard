import  supabase from "../supabase-client"
 
 export async function signInUser(email: string, password: string) {
    try {
     
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if(error) {
        return {success: false, error: error.message}
      }
      return {sucess: true, data}
    } catch (error) {

      if(error instanceof Error) {
        console.error('failed to sign in', error.message)
        return {sucess: false, error: error.message}
      }
      return {sucess: false, error: error}
    }
  }