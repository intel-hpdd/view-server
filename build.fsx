#r "paket: nuget  Fake.JavaScript.Npm //"
#r "paket: nuget Fake.Core.Target //"
#r "paket: nuget Thoth.Json.Net //"
#load "./.fake/build.fsx/intellisense.fsx"

open System.Text
open Fake.Core
open Fake.IO
open FileSystemOperators
open Globbing.Operators
open Thoth.Json.Net.Decode

let pwd = Shell.pwd()
let specName = "iml-view-server.spec"
let topDir = pwd @@ "_topdir"
let sources = topDir @@ "SOURCES"
let specs =  topDir @@ "SPECS"

let spec = specs @@ specName

let srpms = topDir @@ "SRPMS"
let buildDir = pwd @@ "targetdir"
let coprKey = pwd @@ "copr-key"

let getPackageVersion () =
  Fake.IO.File.readAsString "package.json"
    |> decodeString (field "version" string)
    |> function
      | Ok x -> x
      | Error e ->
        raise (exn ("Could not find package.json version, got this error" + e))

Target.create "Clean" (fun _ ->
  Shell.cleanDirs [buildDir; topDir]
)

Target.create "Topdir" (fun _ ->
  Shell.mkdir topDir
  Shell.mkdir sources
  Shell.mkdir specs
)

Target.create "NpmBuild" (fun _ ->
  Fake.JavaScript.Npm.install(id)
  Fake.JavaScript.Npm.run "postversion" id
  Fake.JavaScript.Npm.exec ("pack " + pwd) (fun o -> { o with WorkingDirectory = sources })
)

Target.create "BuildSpec" (fun _ ->
  let v =
    Fake.IO.File.readAsString "package.json"
    |> decodeString (field "version" string)
    |> function
      | Ok x -> x
      | Error e ->
        raise (exn ("Could not find package.json version, got this error" + e))

  Fake.IO.Templates.load [specName + ".template"]
    |> Fake.IO.Templates.replaceKeywords [("@version@", v)]
    |> Seq.iter(fun (_, file) ->
      let x = UTF8Encoding()

      Fake.IO.File.writeWithEncoding x false spec (Seq.toList file)
    )
)

Target.create "SRPM" (fun _ ->
  let args = (sprintf "-bs --define \"_topdir %s\" %s" topDir specs)
  Shell.Exec ("rpmbuild", args)
    |> ignore
)

Target.create "Copr" (fun p ->
  let repo =
    p.Context.Arguments
    |> Seq.tryHead
    |> Option.defaultValue "joegrund/mfl-devel"

  if not (File.exists coprKey) then
    failwithf "Expected copr key at: %s, it was not found" coprKey

  let path =
    !!(srpms @@ "*.src.rpm")
      |> Seq.tryHead
      |> function
        | Some x -> x
        | None -> failwith "Could not find SRPM"


  let args = sprintf "--config %s build %s %s" coprKey repo path

  Shell.Exec ("copr-cli", args)
    |> ignore
)

open Fake.Core.TargetOperators

"Clean"
  ==> "Topdir"
  ==> "NpmBuild"
  ==> "BuildSpec"
  ==> "SRPM"
  ==> "Copr"


// start build
Target.runOrDefault "Copr"
