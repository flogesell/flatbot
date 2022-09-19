import { Injectable, Logger } from '@nestjs/common';
// TODO; remove when own implementation is working
// import * as azureJWT from 'azure-jwt-verify';
import * as jwt from 'jsonwebtoken';
// import { GlobalConfigService } from '../config/config.service';
import { GlobalConfigService } from '../config/config.service';
// import {
//   rsaPublicKeyPem,
//   simpleJoinPublicKey
// } from '../../../assets/lib/getPem';
// import * as MSAL from 'msal';

// https://github.com/99xt/azure-jwt-verify#readme

@Injectable()
export class JwtService {
  // private publicKeys = {};

  constructor(
    // private readonly configService: GlobalConfigService,
    private readonly logger: Logger,
    private readonly globalConfigService: GlobalConfigService,
  ) {}

  /**
   * verifies bearer token against azure AD, does auto cache
   * microsoft public keys for performance reasons
   *
   * @param bearerToken
   * @returns Promise
   */
  async verify(bearerToken: string, req?: unknown): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const token: string = this.extractToken(bearerToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwt.decode(token, { complete: true });
      if (!decoded) {
        return reject('Error Decoding JWT Token');
      }
      // const jwtKid: string = decoded.header.kid;
      // if (!jwtKid) {
      //   return reject('Invalid JWT Token');
      // }

      // TESTING
      // console.info({ token, decoded });
      this.logger.warn({ token });

      // resolve(decoded);

      const tokenCheckUrl = 'https://graph.microsoft.com/v1.0/me';
      // got(tokenCheckUrl, {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // })
      //   .then((res) => {
      //     const data = JSON.parse(res.body);
      //     if (data.error) {
      //       reject(new JWTResult('error', data.error.message));
      //     } else {
      //       const tenantIds = this.globalConfigService.getValidTenantIDs();
      //       const tokenTenantId = decoded.payload.tid;

      //       if (tenantIds.indexOf(tokenTenantId) > -1) {
      //         if (req) {
      //           // attach token info to request object for later use
      //           req['access_token_verify_response'] = res.body;
      //           req['decoded_token'] = decoded;
      //         }
      //         resolve(new JWTResult('success', res.body));
      //       } else {
      //         reject(new JWTResult('error', 'tenant id is invalid'));
      //       }
      //     }
      //   })
      //   .catch((err) => reject(err));

      // const clientid = tryAltTenant
      //   ? this.configService.getAltAzureClientID()
      //   : this.configService.getAzureClientID();
      // const tennant = tryAltTenant
      //   ? this.configService.getAltAzureTenant()
      //   : this.configService.getAzureTenant();

      // check if its a
      // V1 token: https://login.microsoftonline.com/{tenant name}/.well-known/openid-configuration
      // or a
      // V2 token: https://login.microsoftonline.com/{tenant name}/v2.0/.well-known/openid-configuration
      // in our case it's a v1.0 token
      // https://login.microsoftonline.com/{tenant name}/.well-known/openid-configuration

      // // azure tokens are valid for 1 hour
      // const config = {
      //   // JWT_URI -> https://login.microsoftonline.com/03e6c03e-074e-474c-8d40-3eac96d82a77/v2.0/.well-known/openid-configuration
      //   // 'JWK_URI': `https://login.microsoftonline.com/${this.configService.getAzureTenant()}/v2.0/.well-known/openid-configuration`,
      //   // https://login.microsoftonline.com/03e6c03e-074e-474c-8d40-3eac96d82a77/discovery/keys
      //   // https://login.microsoftonline.com/03e6c03e-074e-474c-8d40-3eac96d82a77/discovery/keys?appid=3f2cf40f-d9ce-4acc-8b6a-8cd7b0a07966
      //   // JWK_URI: `https://login.microsoftonline.com/${this.configService.getAzureTenant()}/discovery/keys?appid=${this.configService.getAzureClientID()}`,
      //   // JWK_URI: 'https://login.microsoftonline.com/common/discovery/keys',
      //   // JWK_URI: `https://login.microsoftonline.com/${tennant}/discovery/keys?appid=com.uniqbit.b2binfoqa`,
      //   // JWK_URI: `https://login.microsoftonline.com/common/discovery/keys?appid=${tennant}`,
      //   JWK_URI: `https://login.microsoftonline.com/${tennant}/discovery/keys?appid=${clientid}`,
      //   // JWK_URI: `https://login.microsoftonline.com/${tennant}/.well-known/openid-configuration`,

      //   // ISS -> https://login.microsoftonline.com/03e6c03e-074e-474c-8d40-3eac96d82a77/wsfed
      //   // ISS: this.configService.getAzureTenant(),
      //   // ISS: undefined,
      //   // ISS: tennant,
      //   // ISS: `https://login.microsoftonline.com/${this.configService.getAzureTenant()}/wsfed`,

      //   // AUD -> ClientID: 3f2cf40f-d9ce-4acc-8b6a-8cd7b0a07966
      //   AUD: clientid
      // };

      // // TESTING
      // console.info(config.JWK_URI);

      // const publicKey = await this.getPublicKey(config.JWK_URI, jwtKid);
      // if (!publicKey) {
      //   return reject('JWT public key not found');
      // }

      // // TESTING
      // console.info({ publicKey });

      //       const temp = `-----BEGIN RSA PUBLIC KEY-----
      // MIIBCgKCAQEAyTKa6m5GFOllz7oIHFCkvRJoBv7wLMuKIPLHbFGh5yOiO8o3akoqMhf1x6MxINGhZo6dkIrhVlVfWJhEJZPVaQdvyvVmlIZruhcbz3PGMqPAbjq2JqbB1mMnsyGHx+ovP0Cm5xj8sgI8wm67p3nosqzqFvg6mPKVO+w1QBr5seDU2AwU2DR88LF2v03Zjgn4mGvPdUOXihTQoNlf+nJFduXMDyRgZabnR2HlYHhagHwy1beWW1WtEaPz8iBN/0bGkGw705aDBUHJkdTty1mzsCZRur/n0imqXu9IzoSyiq5d0yKrRA5xkA+K3DMeRMquZ5QvPT9Eee4EZfFL97zBfQIDAQAB
      // -----END RSA PUBLIC KEY-----`;
      //       const temp2 = `
      // -----BEGIN RSA PUBLIC KEY-----
      // MIIBCgKCAQEAyTKa6m5GFOllz7oIHFCkvRJoBv7wLMuKIPLHbFGh5yOiO8o3akoq
      // Mhf1x6MxINGhZo6dkIrhVlVfWJhEJZPVaQdvyvVmlIZruhcbz3PGMqPAbjq2JqbB
      // 1mMnsyGHx+ovP0Cm5xj8sgI8wm67p3nosqzqFvg6mPKVO+w1QBr5seDU2AwU2DR8
      // 8LF2v03Zjgn4mGvPdUOXihTQoNlf+nJFduXMDyRgZabnR2HlYHhagHwy1beWW1Wt
      // EaPz8iBN/0bGkGw705aDBUHJkdTty1mzsCZRur/n0imqXu9IzoSyiq5d0yKrRA5x
      // kA+K3DMeRMquZ5QvPT9Eee4EZfFL97zBfQIDAQAB
      // -----END RSA PUBLIC KEY-----
      //         `;
      //       const cert = `
      // -----BEGIN CERTIFICATE-----
      // MIIDBTCCAe2gAwIBAgIQQiR8gZNKuYpH6cP+KIE5ijANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTIwMDgyODAwMDAwMFoXDTI1MDgyODAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMkymupuRhTpZc+6CBxQpL0SaAb+8CzLiiDyx2xRoecjojvKN2pKKjIX9cejMSDRoWaOnZCK4VZVX1iYRCWT1WkHb8r1ZpSGa7oXG89zxjKjwG46tiamwdZjJ7Mhh8fqLz9ApucY/LICPMJuu6d56LKs6hb4OpjylTvsNUAa+bHg1NgMFNg0fPCxdr9N2Y4J+Jhrz3VDl4oU0KDZX/pyRXblzA8kYGWm50dh5WB4WoB8MtW3lltVrRGj8/IgTf9GxpBsO9OWgwVByZHU7ctZs7AmUbq/59Ipql7vSM6EsoquXdMiq0QOcZAPitwzHkTKrmeULz0/RHnuBGXxS/e8wX0CAwEAAaMhMB8wHQYDVR0OBBYEFGcWXwaqmO25Blh2kHHAFrM/AS2CMA0GCSqGSIb3DQEBCwUAA4IBAQDFnKQ98CBnvVd4OhZP0KpaKbyDv93PGukE1ifWilFlWhvDde2mMv/ysBCWAR8AGSb1pAW/ZaJlMvqSN/+dXihcHzLEfKbCPw4/Mf2ikq4gqigt5t6hcTOSxL8wpe8OKkbNCMcU0cGpX5NJoqhJBt9SjoD3VPq7qRmDHX4h4nniKUMI7awI94iGtX/vlHnAMU4+8y6sfRQDGiCIWPSyypIWfEA6/O+SsEQ7vZ/b4mXlghUmxL+o2emsCI1e9PORvm5yc9Y/htN3Ju0x6ElHnih7MJT6/YUMISuyob9/mbw8Vf49M7H2t3AE5QIYcjqTwWJcwMlq5i9XfW2QLGH7K5i8
      // -----END CERTIFICATE-----
      //       `;
      //       const cert2 = `
      // -----BEGIN CERTIFICATE-----
      // MIIDBTCCAe2gAwIBAgIQQiR8gZNKuYpH6cP+KIE5ijANBgkqhkiG9w0BAQsFADAtMSswKQYDVQQDEyJhY2NvdW50cy5hY2Nlc3Njb250cm9sLndpbmRvd3MubmV0MB4XDTIwMDgyODAwMDAwMFoXDTI1MDgyODAwMDAwMFowLTErMCkGA1UEAxMiYWNjb3VudHMuYWNjZXNzY29udHJvbC53aW5kb3dzLm5ldDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMkymupuRhTpZc+6CBxQpL0SaAb+8CzLiiDyx2xRoecjojvKN2pKKjIX9cejMSDRoWaOnZCK4VZVX1iYRCWT1WkHb8r1ZpSGa7oXG89zxjKjwG46tiamwdZjJ7Mhh8fqLz9ApucY/LICPMJuu6d56LKs6hb4OpjylTvsNUAa+bHg1NgMFNg0fPCxdr9N2Y4J+Jhrz3VDl4oU0KDZX/pyRXblzA8kYGWm50dh5WB4WoB8MtW3lltVrRGj8/IgTf9GxpBsO9OWgwVByZHU7ctZs7AmUbq/59Ipql7vSM6EsoquXdMiq0QOcZAPitwzHkTKrmeULz0/RHnuBGXxS/e8wX0CAwEAAaMhMB8wHQYDVR0OBBYEFGcWXwaqmO25Blh2kHHAFrM/AS2CMA0GCSqGSIb3DQEBCwUAA4IBAQDFnKQ98CBnvVd4OhZP0KpaKbyDv93PGukE1ifWilFlWhvDde2mMv/ysBCWAR8AGSb1pAW/ZaJlMvqSN/+dXihcHzLEfKbCPw4/Mf2ikq4gqigt5t6hcTOSxL8wpe8OKkbNCMcU0cGpX5NJoqhJBt9SjoD3VPq7qRmDHX4h4nniKUMI7awI94iGtX/vlHnAMU4+8y6sfRQDGiCIWPSyypIWfEA6/O+SsEQ7vZ/b4mXlghUmxL+o2emsCI1e9PORvm5yc9Y/htN3Ju0x6ElHnih7MJT6/YUMISuyob9/mbw8Vf49M7H2t3AE5QIYcjqTwWJcwMlq5i9XfW2QLGH7K5i8
      // -----END CERTIFICATE-----
      //       `;

      //       const testtoken = `
      // eyJ0eXAiOiJKV1QiLCJub25jZSI6IldVYXJWaDFWcE4tRGdQalJQbUg1dEdDeW41ckRUbTdSUnBEQU11dWYyRTgiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lZDc2YjA0Zi0wOTkxLTQ3ODEtYjk1YS03NDRiYmU1ZGU3NTIvIiwiaWF0IjoxNjA1Nzk2MzUyLCJuYmYiOjE2MDU3OTYzNTIsImV4cCI6MTYwNTgwMDI1MiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVVRQXUvOFJBQUFBTERRcE5jQm9sK201N1l5Mlh5OTNZSzNoRjkzR2FhQlNRTnpXZzg3dWRDcXdSdTBSQnZnaXgzNitxTHhyVVhTRmtGOUdJWkZRTzRYK1NMdmk2aUplQ0E9PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiYjJibmV3cy1kdW1teSIsImFwcGlkIjoiMzdiNDJjNzctNTBhMy00Y2M0LWJjOWYtNzk3NTUzMjUxNDNiIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCaWNobG1laWVyIiwiZ2l2ZW5fbmFtZSI6IkNocmlzdG9waCIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjkzLjEwNC42My4xODIiLCJuYW1lIjoiQ2hyaXN0b3BoIEJpY2hsbWVpZXIiLCJvaWQiOiJlYjBiMzcxYi0yYjExLTQzMWUtYjc3Ny1lOGZhMDE3MzJmNzIiLCJwbGF0ZiI6IjIiLCJwdWlkIjoiMTAwMzIwMDBDQjUzOEVCRSIsInJoIjoiMC5BUjhBVDdCMjdaRUpnVWU1V25STHZsM25VbmNzdERlalVNUk12Sjk1ZFZNbEZEc2ZBTHcuIiwic2NwIjoib3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic3ViIjoiX2NOX2RVaFJQT2h5eTdUcWFPODRObDR2eUJMUHg0YUNlUkFJWEZHZ2VoOCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImVkNzZiMDRmLTA5OTEtNDc4MS1iOTVhLTc0NGJiZTVkZTc1MiIsInVuaXF1ZV9uYW1lIjoiYy5iaWNobG1laWVyQHVuaXFiaXQuZGUiLCJ1cG4iOiJjLmJpY2hsbWVpZXJAdW5pcWJpdC5kZSIsInV0aSI6InlsUHIyWFRGb2tlc3hxcUtmLWdyQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiLTduNXdNRnR2dVViNGVwNGhMcVE2TGRqUzJDa3gxZ185WGZOWFJiSENocyJ9LCJ4bXNfdGNkdCI6MTQ5NzMzNDUxMH0.n-x-KoMwGsMGPkGoqwzxurS4itWJFs8ZpHiS3xUWc3dSqTRHnxJeWShv0HYcwwzTChz8Kk3iExL5e50i5BrpueYGML4_Gqm1-3_k3fto7lXxoVmEH1RRxqawnkgR5pjjKR68Ty1gN-8W0nPswaJVd6Wxh0uzxlXLXLCf-VW_GRCUWXNRTefq-0suxBo5U8ByvcRSy8t8KQnk5KSsEe3do8_Q7oEKAA8Z7WtuX0HoFTX8nmQAEqPVLvaRQTVXUgYrPYm9rNZnS58pC-8PI7NiZ5R_jstfX3TwAnL_LjMHGU1HA5xgV2hOpzGhWD0hJVNYIN2gfBo85yD3Is4Zvwc6SA
      //       `;

      //       console.info({ temp2 });

      //  algorithms: ['RS256'], audience: config.AUD, issuer: config.ISS
      // jwt.verify(
      //   token,
      //   publicKey.x5c,
      //   // {
      //   //   algorithms: decoded.header['alg'],
      //   //   audience: config.AUD,
      //   //   issuer: config['ISS']
      //   // },
      //   (error, decoded) => {
      //     if (!error) {
      //       resolve(decoded);
      //     } else {
      //       reject(new JWTResult('error', JSON.stringify(error)));
      //     }
      //   }
      // );
      // https://login.microsoftonline.com/<tenant-id>/
      // https://login.microsoftonline.com/ed76b04f-0991-4781-b95a-744bbe5de752/

      // const msalConfig = {
      //   auth: {
      //     clientId: clientid
      //   }
      // };
      // const msalInstance = new MSAL.UserAgentApplication(msalConfig);
      // MSAL;
    });
  }

  /**
   * does locally decode the base64 token string
   * can be used to e. g. get the KID from token payload
   * @param bearerToken
   * @returns Promise
   */
  async decode(bearerToken: string): Promise<any> {
    const token: string = this.extractToken(bearerToken);

    return new Promise((resolve, reject) => {
      try {
        // resolve(new JWTResult('success', jwt.decode(token)));
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Helper to retrieve the token only
   * @param bearerToken
   * @returns string
   */
  private extractToken(bearerToken: string): string {
    let token = bearerToken;
    if (bearerToken && bearerToken.toLowerCase().indexOf('bearer') > -1) {
      const tsplitt = bearerToken.split(' ');
      if (tsplitt && tsplitt.length > 1) token = tsplitt[1];
    }
    return token;
  }

  public getAuthorization(req: Request): string {
    return req.headers['authorization'] || req.headers['Authorization'];
  }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // async getPublicKey(JWK_URI: string, jwtKid: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (this.hasPublicKey(jwtKid)) {
  //       resolve(this.publicKeys[jwtKid]);
  //     } else {
  //       got(JWK_URI)
  //         .then((res) => {
  //           if (JSON.parse(res.body)['keys']) {
  //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //             JSON.parse(res.body)['keys'].forEach((entry: any) => {
  //               this.publicKeys[entry.kid] = {
  //                 ne: rsaPublicKeyPem(entry.n, entry.e),
  //                 x5c: simpleJoinPublicKey(entry.x5c)
  //               };
  //             });
  //           }
  //           resolve(this.publicKeys[jwtKid]);
  //         })
  //         .catch((err) => reject(err));
  //     }
  //   });
  // }

  // hasPublicKey(jwtKid: string): boolean {
  //   return !!this.publicKeys[jwtKid];
  // }
}
