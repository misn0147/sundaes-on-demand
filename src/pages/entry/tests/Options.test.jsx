import { render, screen } from "@testing-library/react";
import Options from "../Options";

test("displays image for each scoop from the server", async () => {
    render(<Options optionType="scoops" />);

    // find images
    const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
    expect(scoopImages).toHaveLength(2); // because we have 2 in our handlers array 

    // confirm alt text of images
    const altText = scoopImages.map((element) => element.alt);
    expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});
