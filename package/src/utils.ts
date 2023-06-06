import reflect from "@alumna/reflect";

export async function copyFiles(dest?: string) {
  const dist = process.env.BUILD_PATH ?? "./dist";
  const server = process.env.SERVER_PATH ?? "./server";

  const { res, err } = await reflect({
    src: dest ?? dist,
    dest: server,
    delete: false,
  });
  console.log(res);

  if (err) {
    throw new Error(err);
  }
}
