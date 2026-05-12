import type { LoginOutput } from '../../application/dtos/auth.js'

export function serializeLoginOutput(output: LoginOutput) {
  return {
    token: output.token,
    refreshToken: output.refreshToken,
    user: output.user,
  }
}
