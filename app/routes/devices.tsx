import { Container } from "@mantine/core";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return {
    title: "/devices - mmatt.net",
    description: "mmatt.net/projects - specs and stuff.",
  };
}

export default function DevicesPage() {
  return (
      <Container>
        <h1>/devices</h1>
        
        <h2>main pc</h2>
          <p>
            <ul>
              <li>
                CPU: Intel i9-9900K
              </li>
              <li>RAM: 16GB DDR4</li>
              <li>GPU: RTX 2070</li>
              <li>OS: Windows 11</li>
              <li>Storage:</li>
              <ul>
                <li>NVME: WD_BLACK: 1TB</li>
                <li>SSD: Random generic one from how the computer came: 1TB</li>
              </ul>
              <li>Amazon Listing: Click Here</li>
              <li>Keyboard: Glorious GMMK TKL: Gateron Reds</li>
              <li>Mouse: Finalmouse Starlight-12 (Gold) - 400 DPI</li>
              <li>Benchmark: Click Here</li>
              <li>PC Part Picker: Click Here</li>
            </ul>
          </p>
      </Container>
    );
  } 
  