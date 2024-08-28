# Cycles

The Cycles page is a crucial component of the DFX Dashboard, allowing you to manage and utilize cycles, the fuel for computation on the Internet Computer. Here you can view your cycle balance, convert ICP to cycles, transfer cycles, and top up canisters.

## Overview

The Cycles page provides three main functions:
- **Converting** ICP to cycles
- **Transferring** cycles to other principals
- **Topping up canisters** with cycles

## Cycles Balance

At the top of the Cycles page, you'll see your current cycles balance:

<div class="image-border">

![Cycles Balance](/features/cycles/cycles-balance.png)

</div>

- The balance is displayed in TC (trillion cycles).
- Use the **Refresh** button to update your balance.

:::tip
Regularly monitor your cycle balance to ensure you have sufficient cycles for your operations on the Internet Computer.
:::

## Converting ICP to Cycles

To convert ICP to cycles:

1. Click on the **Convert ICP** tab.
2. Enter the amount of ICP you want to convert in the **Amount (ICP)** field.
3. Click the **Convert to Cycles** button to process the conversion.

<div class="image-border">

![Convert ICP](/features/cycles/top-up-canister.png)

</div>

:::warning
The conversion rate between ICP and cycles may vary. Always check the current rate before converting to ensure you're getting the expected amount of cycles.
:::

## Transferring Cycles

To transfer cycles:

1. Click on the **Transfer Cycles** tab.
2. Enter the recipient's principal in the **To (Principal)** field.
3. Specify the amount of cycles to transfer in the **Amount (Cycles)** field.
4. Click the **Transfer Cycles** button to send the cycles.

<div class="image-border">

![Transfer Cycles](/features/cycles/transfer-cycles.png)

</div>

:::warning
Double-check the recipient's principal before transferring, as cycle transfers cannot be reversed. Sending cycles to an incorrect address will result in permanent loss.
:::

## Topping Up Canisters

To top up a canister:

1. Click on the **Top Up Canister** tab.
2. Choose how to select the canister:
   - **Select from list**: Choose a canister from your projects
   - **Enter custom ID**: Input a specific canister ID
3. Enter the amount of cycles to send in the **Amount (Cycles)** field.
4. Click the **Top Up Canister** button to complete the process.

<div class="image-border">

![Top Up Canister](/features/cycles/convert-icp.png)

</div>

:::tip
Regularly check and top up your canisters to ensure they have sufficient cycles to continue running. Set up alerts or reminders to avoid unexpected canister stoppages due to cycle depletion.
:::

## Best Practices

:::tip
Optimize your cycle management with these tips:

- Monitor your balance: Regularly check your cycle balance to ensure you have enough for your operations.
- Plan conversions: Convert ICP to cycles in advance to avoid running out during critical operations.
- Estimate needs: Before topping up canisters, estimate their cycle consumption to avoid over or under-funding.
- Keep records: Track your cycle transfers and conversions for better financial management.
:::

## Troubleshooting

:::warning
Watch out for these common issues:

- If your balance isn't updating, try refreshing the page or restarting the DFX Dashboard.
- For failed conversions, ensure you have sufficient ICP balance and that the network is operational.
- If a transfer fails, double-check the recipient's principal and your available cycle balance.
- For canister top-up issues, verify that the canister ID is correct and that you have sufficient cycles.
:::

## Additional Resources

- [Understanding Cycles on the Internet Computer](https://internetcomputer.org/docs/current/concepts/tokens-cycles)
- [ICP to Cycles Conversion](https://internetcomputer.org/docs/current/developer-docs/build/project-setup/cycles)
- [Cycle Wallet and Management](https://internetcomputer.org/docs/current/developer-docs/build/project-setup/manage-cycles)
- [Cycles Economy on the Internet Computer](https://internetcomputer.org/whitepaper.pdf)

<style>
.image-border img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.vp-doc h2 {
    border-top: 1px solid #eaecef;
    padding-top: 24px;
    margin-top: 24px;
}
</style>