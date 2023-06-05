import reflect from "@alumna/reflect";

export async function copyFiles() {
  const dist = process.env.BUILD_PATH ?? "./dist";
  const server = process.env.SERVER_PATH ?? "./server";

  const { res, err } = await reflect({
    src: dist,
    dest: server,
    delete: false,
  });
  console.log(res);

  if (err) {
    throw new Error(err);
  }
}
