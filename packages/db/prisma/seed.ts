import { seguroVerticals } from "@seguro/config";
import { prisma } from "../src/index.js";

/**
 * Local dev seed: syncs Vertical rows from the live config (packages/config)
 * and creates one example partner so the routing/delivery pipeline is
 * exercisable end to end without real partner credentials. Run with
 * `pnpm db:seed`.
 */
async function main() {
  for (const vertical of seguroVerticals) {
    await prisma.vertical.upsert({
      where: { id: vertical.id },
      create: {
        id: vertical.id,
        siteId: vertical.siteId,
        name: vertical.name,
        fields: vertical.fields,
        active: vertical.active,
      },
      update: {
        name: vertical.name,
        fields: vertical.fields,
        active: vertical.active,
      },
    });
  }

  const partner = await prisma.partner.upsert({
    where: { id: "example-broker" },
    create: {
      id: "example-broker",
      name: "Example Broker SA",
      channels: [
        { type: "webhook", config: { url: "http://localhost:4001/webhook-sink" } },
      ],
    },
    update: {},
  });

  await prisma.partnerVertical.upsert({
    where: {
      partnerId_verticalId: { partnerId: partner.id, verticalId: "seguro-de-auto" },
    },
    create: {
      partnerId: partner.id,
      verticalId: "seguro-de-auto",
      cplGs: 50_000,
      exclusive: true,
      priority: 1,
      weight: 1,
    },
    update: {},
  });

  console.log("Seed complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
