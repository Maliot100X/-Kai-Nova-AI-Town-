import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjEyMTUyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MEJGNDVGOTY3RTkwZmZENjA2MzVkMUFDMTk1MDYyYTNBOUZjQzYyQiJ9",
      payload: "eyJkb21haW4iOiJrYWktbm92YS1zaXN0ZXJzLXByb3RvY29sLWtudHdzLnZlcmNlbC5hcHAifQ",
      signature: "MHhmMTUwMWRjZjRhM2U1NWE1ZjViNGQ5M2JlNGIxYjZiOGE0ZjcwYWQ5YTE1OTNmNDk1NzllNTA2YjJkZGZjYTBlMzI4ZmRiNDZmNmVjZmFhZTU4NjYwYzBiZDc4YjgzMzc2MDAzYTkxNzhkZGIyZGIyZmM5ZDYwYjU2YTlmYzdmMDFj"
    },
    frame: {
      version: "1",
      name: "Truth Drilling Protocol",
      iconUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/icon.png",
      homeUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/",
      imageUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/og-image.png",
      buttonTitle: "Start Drilling",
      splashImageUrl: "https://kai-nova-sisters-protocol-kntws.vercel.app/icon.png",
      splashBackgroundColor: "#050505"
    }
  };

  return NextResponse.json(manifest);
}
