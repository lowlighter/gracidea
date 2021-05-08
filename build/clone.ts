/** Clone a repository */
export async function clone({ repository, target }: { repository: string; target: string }) {
  //Perform checks
  try {
    const { isDirectory } = await Deno.stat(target)
    if (!isDirectory)
      throw new Error("Error: Target directory already in use")
    console.debug(`already cloned: ${repository}`)
    return
  }
  catch (error) {
    if (!(error instanceof Deno.errors.NotFound))
      throw error
  }
  //Clone repository
  const { success } = await Deno.run({ cmd: ["git", "clone", repository, target, "--depth", "1"] }).status()
  if (!success)
    throw new Error("Error: An error occured during cloning")
  console.debug(`cloned: ${repository}`)
}
