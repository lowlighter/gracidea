/** Clone a repository */
export async function clone({ repository, target, branch, clean = false }: { repository: string; target: string; branch?: string; clean?: boolean }) {
  //Perform checks
  console.debug(`cloning: ${repository} to ${target}`)
  let cloned = false
  try {
    const { isDirectory } = await Deno.stat(target)
    if (!isDirectory)
      throw new Error("Error: Target directory already in use")
    if (clean) {
      console.debug(`cleaning: ${target}`)
      await Deno.remove(target, { recursive: true })
    }
    else {
      cloned = true
    }
  }
  catch (error) {
    if (!(error instanceof Deno.errors.NotFound))
      throw error
  }

  //Clone repository
  if (!cloned) {
    const { success } = await Deno.run({ cmd: ["git", "clone", `https://github.com/${repository}.git`, target, "--depth", "1", ...(branch ? ["--no-single-branch"] : [])] })
      .status()
    if (!success)
      throw new Error("Error: An error occured during cloning")
    console.debug(`cloned: ${repository}`)
  }
  else {
    console.debug(`already cloned: ${repository}`)
  }

  //Checkout branch
  if (branch) {
    const { success } = await Deno.run({ cmd: ["git", "checkout", branch], cwd: target }).status()
    if (!success)
      throw new Error("Error: An error occured while checking out branch")
    console.debug(`branch: ${branch}`)
  }
}
