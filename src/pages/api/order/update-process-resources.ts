import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";
import { generateEmailer } from "@utils/email/generateEmailer";
import { updateProcessResourcesHTML } from "@utils/email/updateProcessResources";
import { ProcessUpdateResourcesSchema } from "@backend/schemas/ProcessUpdateResourcesSchema";

const updateProcessResources = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const {
      id: processID,
      recursos,
      esDeProduccion,
    } = ProcessUpdateResourcesSchema.parse(req.body);

    const { sendEmail } = generateEmailer({
      password: process.env.MAILGUN_SMTP_PASS,
      user: "postmaster@sandbox5cd70f8d5603470a9ab44d2503b4ecfe.mailgun.org",
      from: "brad@sandbox5cd70f8d5603470a9ab44d2503b4ecfe.mailgun.org",
      fromTitle: "Soporte HS-Taller",
    });

    const userEmails = recursos.map((el) => el.key);

    const users = await prisma.user.findMany({
      where: { email: { in: userEmails } },
    });

    if (esDeProduccion) {
      await prisma.procesoProductivoOrden.update({
        where: { id: processID },
        data: {
          usuarioDeServicio: { set: [] },
          lastUpdated: new Date(Date.now()),
        },
      });

      const proceso = await prisma.procesoProductivoOrden.update({
        include: {
          orden: { include: { orden: { include: { user: true } } } },
          proceso: true,
        },
        where: { id: processID },
        data: {
          usuarioDeServicio: {
            connect: users.map((el) => ({ email: el.email })),
          },
          FichaTecnica: {
            updateMany: {
              data: {
                updatedAt: new Date(),
              },
              where: {
                procesoId: processID,
              },
            },
          },
          lastUpdated: new Date(),
        },
      });

      sendEmail({
        to: proceso.orden.orden.user.email,
        subject: "Modificación pedido orden - HS-Taller",
        html: updateProcessResourcesHTML({
          name: proceso.orden.orden.user.name,
          orderId: proceso.orden.id,
          processName: proceso.proceso.nombre,
        }),
      })
        .then(() => res.status(200).json(proceso))
        .catch((err) => res.status(400).json({ error: err }));
      return;
    }

    //remove all resources from process
    await prisma.procesoDesarrolloOrden.update({
      where: { id: processID },
      data: {
        usuarioDeServicio: { set: [] },
        lastUpdated: new Date(Date.now()),
      },
    });

    const proceso = await prisma.procesoDesarrolloOrden.update({
      include: { orden: { include: { user: true } }, proceso: true },
      where: { id: processID },
      data: {
        usuarioDeServicio: {
          connect: users.map((el) => ({ email: el.email })),
        },
        FichaTecnica: {
          update: {
            updatedAt: new Date(),
          },
        },
        lastUpdated: new Date(),
      },
    });

    sendEmail({
      to: proceso.orden.user.email,
      subject: "Modificación pedido orden - HS-Taller",
      html: updateProcessResourcesHTML({
        name: proceso.orden.user.name,
        orderId: proceso.orden.id,
        processName: proceso.proceso.nombre,
      }),
    })
      .then(() => res.status(200).json(proceso))
      .catch((err) => res.status(400).json({ error: err }));
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default updateProcessResources;
