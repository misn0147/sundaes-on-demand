import { render, screen } from "../../../test-utils/testing-library-utils";
import Options from "../Options";
import { OrderDetailsProvider } from '../../../contexts/OrderDetails';

test("displays image for each scoop from the server", async () => {
    render(<Options optionType="scoops" />);

    // find images
    const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
    expect(scoopImages).toHaveLength(2); // because we have 2 in our handlers array  

    // confirm alt text of images
    const altText = scoopImages.map((element) => element.alt);
    expect(altText).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test('display image for each topping from the server', async () => {
    render (<Options optionType="toppings" />);

    //find images
    const toppingImages = await screen.findAllByRole("img", { name: /topping$/i});
    expect(toppingImages).toHaveLength(3);

    // confirm alt text of images
    const imageTitles = toppingImages.map((img) => img.alt);
    expect(imageTitles).toEqual(["Cherries topping", "M&Ms topping", "Hot fudge topping"]);
});

