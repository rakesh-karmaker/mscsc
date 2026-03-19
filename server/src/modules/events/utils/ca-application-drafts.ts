// CA Application Confirmation Draft
interface CAApplicationConfirmationDraftProps {
  eventName: string;
  logoUrl: string;
  code: string;
  name: string;
}

export function caApplicationConfirmationDraft({
  eventName,
  logoUrl,
  code,
  name,
}: CAApplicationConfirmationDraftProps) {
  const year = new Date().getFullYear();
  return `
        <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
        <title>${eventName} CA Confirmation</title>
    </head>

    <body
        style="margin:0; background-color: #e9dede00; box-sizing: border-box; font-family: 'Poppins', Arial, sans-serif; color: #1d4b52;">
        <center class="wrapper">
            <table class="main"
                style="width: 100%; max-width: 568px; background-color: #fff8ec; height: 100%; border-spacing: 0;">
                <tr>
                    <td style="width: 100%; padding: 0;">
                        <table class="top" style="border-spacing: 0;width: 100%; height: 100%; background-color: #fff8ec;">
                            <tr>
                                <td>
                                    <center>
                                        <img src="https://ik.imagekit.io/testingimage/events/banner.png" alt="banner"
                                            style="width: 100%; height: 100%; margin: 0; padding: 0;">
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h2
                                        style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px;  color: #1d4b52;">
                                        CA Application Approved!
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <img src="${logoUrl}" alt="logo"
                                            style="width: 200px; height: 200px; margin: 0; padding: 0; object-fit: cover; object-position: center;">
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <p
                                            style="margin: 10px 0 0px 0; padding: 0 10px; padding-bottom: 0px; font-size: 20px; max-width: 90%; text-align: center; color: #1d4b52; opacity: 0.8;">
                                            You have been approved as a CA for ${eventName}!
                                        </p>
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="width: 100%; padding: 0;  border: 3px solid #fff8ec;">
                        <table class="id-c" style="border-spacing: 0;; width: 100%;  height: 100%;">
                            <tr style="width: 100%; height: 100%; text-align: center;">
                                <td>
                                    <p style="margin-bottom: 10px; padding: 0; color: #1d4b52;">
                                        Your CA code is:
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <table class="id-con"
                                            style="border-spacing: 0; padding: 25px 30px; text-align: center; background-color: #fff1da; border: 2px solid #043841; border-radius: 5px;">
                                            <tr>
                                                <td>
                                                    <h1
                                                        style="margin: 0; padding: 0;letter-spacing: 0.06em; font-size: 45px; font-weight: 500; user-select: text; line-height: 36px; color: #043841;">
                                                        ${code}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td>
                        <h2
                            style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 10px; margin-bottom: 20px;  color: #1d4b52;">
                            Welcome to our team, ${name}!
                        </h2>
                    </td>
                </tr>

                <tr>
                    <td>
                        <Center>
                            <table style="width: 95%; padding: 0; border-top: 3px solid rgba(0, 0, 0, 0.336);">
                                <tr>
                                    <td>
                                        <h2
                                            style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px;  color: #1d4b52;">
                                            <span style="color: #043841;">Questions?</span> Contact Us!
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <center>
                                            <p
                                                style="margin: 10px 0 5px 0; padding: 0 20px; font-size: 16px; max-width: 400px; text-align: center; color: #1d4b52; opacity: 0.8;">
                                                Hit us up on our social media or send us an email at
                                                <a href="mailto:mscscofficial17@gmail.com"
                                                    style="color: #1d4b52; text-decoration: underline;">
                                                    mscscofficial17@gmail.com
                                                </a>
                                            </p>
                                        </center>
                                    </td>
                                </tr>

                            <tr>
                                <td>
                                    <center>
                                        <table class="footer" style="border-spacing: 0;">
                                            <tr>
                                                <td>
                                                    <center>
                                                        <p style="margin-bottom: 30px;">
                                                            <a href="https://www.facebook.com/MSCSC2014"
                                                                class="facebook" title="facebook"
                                                                style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Facebook</a>

                                                            <span
                                                                style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                            <a href="https://mscsc.netlify.app/" class="web"
                                                                title="website"
                                                                style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Website</a>

                                                            <span
                                                                style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                            <a href="https://www.instagram.com/_mscsclub_"
                                                                class="instagram" title="instagram"
                                                                style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Instagram</a>
                                                        </p>
                                                    </center>
                                                </td>
                                            </tr>
                                        </table>
                                    </center>
                                </td>
                            </tr>


                            </table>
                        </Center>
                    </td>
                </tr>

                 <tr>
                <td style="width: 100%;  background-color: #043841; padding: 20px 0px; padding-top: 30px;">
                    <center>
                        <table class="footer" style="border-spacing: 0;">
                            <tr>
                                <td>
                                    <Center>
                                        <p
                                            style="text-align: center; margin-top: 5px; padding: 0;font-size: 15px; color: rgba(255, 255, 255, 0.863); max-width: 400px;">
                                            © ${year} <a href="https://mscsc.netlify.app/" class="mscsc"
                                                title="main page"
                                                style="text-decoration: none; text-align: center; color: rgba(255, 255, 255, 0.795);">MSCSC</a>
                                            || All Rights Reserved
                                        </p>
                                    </Center>
                                </td>
                            </tr>
                        </table>
                    </center>
                </td>
            </tr>
            </table>
        </center>
    </body>

    </html>
        `;
}

// CA Application Rejection Draft
interface CAApplicationRejectionDraftProps {
  eventName: string;
  reason: string;
  logoUrl: string;
}

export function caApplicationRejectionDraft({
  eventName,
  reason,
  logoUrl,
}: CAApplicationRejectionDraftProps) {
  const year = new Date().getFullYear();
  return `
    <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
            integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
            crossorigin="anonymous" referrerpolicy="no-referrer" />
        <title>${eventName} CA Application Rejected</title>
    </head>

    <body
        style="margin:0; background-color: #e9dede00; box-sizing: border-box; font-family: 'Poppins', Arial, sans-serif; color: #1d4b52;">
        <center class="wrapper">
            <table class="main"
                style="width: 100%; max-width: 568px; background-color: #fff8ec; height: 100%; border-spacing: 0;">
                <tr>
                    <td style="width: 100%; padding: 0;">
                        <table class="top" style="border-spacing: 0;width: 100%; height: 100%; background-color: #fff8ec;">
                            <tr>
                                <td>
                                    <center>
                                        <img src="https://ik.imagekit.io/testingimage/events/banner.png" alt="banner"
                                            style="width: 100%; height: 100%; margin: 0; padding: 0;">
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h2
                                        style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px;  color: #1d4b52;">
                                        CA Application Rejected for ${eventName}!
                                    </h2>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <img src="${logoUrl}" alt="logo"
                                            style="width: 200px; height: 200px; margin: 0; padding: 0; object-fit: cover; object-position: center;">
                                    </center>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td>
                        <h2
                            style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 10px;   color: #1d4b52;">
                            Reason
                        </h2>
                    </td>
                </tr>

                <tr>
                    <td>
                        <center>
                            <p
                                style="margin: 10px 0 0px 0; margin-bottom: 20px; padding: 0 10px; padding-bottom: 0px; font-size: 20px; max-width: 90%; text-align: center; color: #1d4b52; opacity: 0.8;">
                                ${reason}
                            </p>
                        </center>
                    </td>
                </tr>

                <tr>
                    <td>
                        <Center>
                            <table style="width: 95%; padding: 0; border-top: 3px solid rgba(0, 0, 0, 0.336);">
                                <tr>
                                    <td>
                                        <h2
                                            style="margin: 0; padding: 0 20px; font-size: 32px; font-weight: 500; line-height: 39px; letter-spacing: 0.01em; text-align: center; margin-top: 20px;  color: #1d4b52;">
                                            <span style="color: #043841;">Questions?</span> Contact Us!
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <center>
                                            <p
                                                style="margin: 10px 0 5px 0; padding: 0 20px; font-size: 16px; max-width: 400px; text-align: center; color: #1d4b52; opacity: 0.8;">
                                                Hit us up on our social media or send us an email at
                                                <a href="mailto:mscscofficial17@gmail.com"
                                                    style="color: #1d4b52; text-decoration: underline;">
                                                    mscscofficial17@gmail.com
                                                </a>
                                            </p>
                                        </center>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <center>
                                            <table class="footer" style="border-spacing: 0;">
                                                <tr>
                                                    <td>
                                                        <center>
                                                            <p style="margin-bottom: 30px;">
                                                                <a href="https://www.facebook.com/MSCSC2014"
                                                                    class="facebook" title="facebook"
                                                                    style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Facebook</a>

                                                                <span
                                                                    style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                                <a href="https://mscsc.netlify.app/" class="web"
                                                                    title="website"
                                                                    style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Website</a>

                                                                <span
                                                                    style="font-size: 30px; font-weight: 400; color: #043841; margin: 0;">|</span>

                                                                <a href="https://www.instagram.com/_mscsclub_"
                                                                    class="instagram" title="instagram"
                                                                    style="text-decoration: none; text-align: center; font-size: 17px;color: #1d4b52; margin: 10px 11px;">Instagram</a>
                                                            </p>
                                                        </center>
                                                    </td>
                                                </tr>
                                            </table>
                                        </center>
                                    </td>
                                </tr>


                            </table>
                        </Center>
                    </td>
                </tr>

                <tr>
                    <td style="width: 100%;  background-color: #043841; padding: 20px 0px; padding-top: 30px;">
                        <center>
                            <table class="footer" style="border-spacing: 0;">
                                <tr>
                                    <td>
                                        <Center>
                                            <p
                                                style="text-align: center; margin-top: 5px; padding: 0;font-size: 15px; color: rgba(255, 255, 255, 0.863); max-width: 400px;">
                                                © ${year} <a href="https://mscsc.netlify.app/" class="mscsc"
                                                    title="main page"
                                                    style="text-decoration: none; text-align: center; color: rgba(255, 255, 255, 0.795);">MSCSC</a>
                                                || All Rights Reserved
                                            </p>
                                        </Center>
                                    </td>
                                </tr>
                            </table>
                        </center>
                    </td>
                </tr>
            </table>
        </center>
    </body>

    </html>
    `;
}
