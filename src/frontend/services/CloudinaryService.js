const CLOUDINARY_CLOUD_NAME = "dbem2yyua";
const CLOUDINARY_UPLOAD_PRESET = "img_user_perfil";
// ------------------------------------

const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/v1764297975/`;

/**
 * Envia uma imagem para o Cloudinary usando seu URI local.
 * * @param {string} imageUri - O URI local da imagem selecionada pelo ImagePicker.
 * @returns {Promise<string>} A URL segura (secure_url) da imagem no Cloudinary.
 */
export async function uploadImageToCloudinary(imageUri) {
  if (!imageUri) {
    throw new Error("URI da imagem não fornecido.");
  }

  // 1. Cria o objeto FormData para enviar o arquivo via requisição multipart
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg", // Pode ser ajustado, mas 'image/jpeg' ou 'image/png' é comum
    name: "upload.jpg", // Nome do arquivo que será exibido no Cloudinary
  });
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    // 2. Faz a requisição POST para o endpoint de upload do Cloudinary
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    // 3. Processa a resposta
    const result = await response.json();

    if (response.ok) {
      // Se o upload foi bem-sucedido, retorna a URL final
      return result.secure_url;
    } else {
      // Lida com erros retornados pelo Cloudinary
      console.error("Erro no Cloudinary:", result);
      throw new Error(
        result.error
          ? result.error.message
          : "Falha ao enviar imagem para o Cloudinary."
      );
    }
  } catch (error) {
    // Lida com erros de rede
    console.error("Erro de requisição/conexão:", error);
    throw new Error("Erro ao fazer upload da imagem de perfil.");
  }
}
