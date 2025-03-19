import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";

@ApiTags("Password Reset")
@Controller("password-reset")
export class PasswordResetController {
  @Get("page")
  @ApiOperation({ summary: "Serve password reset page" })
  @ApiQuery({
    name: "token",
    required: true,
    description: "Password reset token",
  })
  async serveResetPage(@Query("token") token: string, @Res() res: Response) {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cambiar Contraseña - QuPot</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }
          h1 {
            color: #333;
            text-align: center;
            margin-bottom: 1.5rem;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #666;
          }
          input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
          }
          button {
            width: 100%;
            padding: 0.75rem;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            margin-top: 1rem;
          }
          button:hover {
            background-color: #0056b3;
          }
          button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          .error {
            color: #dc3545;
            margin-top: 0.5rem;
            display: none;
            font-size: 0.875rem;
          }
          .success {
            color: #28a745;
            margin-top: 0.5rem;
            display: none;
          }
          .password-strength {
            margin-top: 0.5rem;
            height: 4px;
            background-color: #ddd;
            border-radius: 2px;
            overflow: hidden;
          }
          .password-strength-bar {
            height: 100%;
            width: 0;
            transition: width 0.3s ease-in-out;
          }
          .strength-weak { background-color: #dc3545; }
          .strength-medium { background-color: #ffc107; }
          .strength-strong { background-color: #28a745; }
          .requirements {
            margin-top: 0.5rem;
            font-size: 0.875rem;
            color: #666;
          }
          .requirement {
            display: flex;
            align-items: center;
            margin-bottom: 0.25rem;
          }
          .requirement::before {
            content: "•";
            margin-right: 0.5rem;
            color: #dc3545;
          }
          .requirement.valid::before {
            content: "✓";
            color: #28a745;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Cambiar Contraseña</h1>
          <form id="resetForm">
            <div class="form-group">
              <label for="password">Nueva Contraseña</label>
              <input type="password" id="password" name="password" required>
              <div class="password-strength">
                <div id="strengthBar" class="password-strength-bar"></div>
              </div>
              <div class="requirements">
                <div id="length" class="requirement">Mínimo 8 caracteres</div>
                <div id="uppercase" class="requirement">Al menos una mayúscula</div>
                <div id="lowercase" class="requirement">Al menos una minúscula</div>
                <div id="number" class="requirement">Al menos un número</div>
                <div id="special" class="requirement">Al menos un carácter especial (!@#$%^&*)</div>
              </div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required>
            </div>
            <button type="submit" id="submitBtn" disabled>Cambiar Contraseña</button>
          </form>
          <div id="error" class="error"></div>
          <div id="success" class="success"></div>
        </div>

        <script>
          const password = document.getElementById('password');
          const confirmPassword = document.getElementById('confirmPassword');
          const submitBtn = document.getElementById('submitBtn');
          const errorDiv = document.getElementById('error');
          const successDiv = document.getElementById('success');
          const strengthBar = document.getElementById('strengthBar');
          const requirements = {
            length: document.getElementById('length'),
            uppercase: document.getElementById('uppercase'),
            lowercase: document.getElementById('lowercase'),
            number: document.getElementById('number'),
            special: document.getElementById('special')
          };

          function checkPasswordStrength(password) {
            let strength = 0;
            const checks = {
              length: password.length >= 8,
              uppercase: /[A-Z]/.test(password),
              lowercase: /[a-z]/.test(password),
              number: /[0-9]/.test(password),
              special: /[!@#$%^&*]/.test(password)
            };

            // Actualizar indicadores visuales
            Object.keys(checks).forEach(key => {
              requirements[key].classList.toggle('valid', checks[key]);
              if (checks[key]) strength++;
            });

            // Actualizar barra de fuerza
            strengthBar.className = 'password-strength-bar';
            if (strength <= 2) {
              strengthBar.classList.add('strength-weak');
              strengthBar.style.width = '33%';
            } else if (strength <= 4) {
              strengthBar.classList.add('strength-medium');
              strengthBar.style.width = '66%';
            } else {
              strengthBar.classList.add('strength-strong');
              strengthBar.style.width = '100%';
            }

            // Habilitar/deshabilitar botón
            submitBtn.disabled = !Object.values(checks).every(Boolean) || 
                               password !== confirmPassword.value;
          }

          password.addEventListener('input', (e) => {
            checkPasswordStrength(e.target.value);
          });

          confirmPassword.addEventListener('input', () => {
            checkPasswordStrength(password.value);
          });

          document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (password.value !== confirmPassword.value) {
              errorDiv.textContent = 'Las contraseñas no coinciden';
              errorDiv.style.display = 'block';
              successDiv.style.display = 'none';
              return;
            }

            try {
              const response = await fetch('/auth/confirm-password-change', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  token: '${token}',
                  newPassword: password.value,
                }),
              });

              if (response.ok) {
                successDiv.textContent = 'Contraseña actualizada correctamente. Redirigiendo...';
                successDiv.style.display = 'block';
                errorDiv.style.display = 'none';
                
                setTimeout(() => {
                  window.location.href = '/login';
                }, 2000);
              } else {
                const data = await response.json();
                errorDiv.textContent = data.message || 'Error al cambiar la contraseña';
                errorDiv.style.display = 'block';
                successDiv.style.display = 'none';
              }
            } catch (error) {
              errorDiv.textContent = 'Error al conectar con el servidor';
              errorDiv.style.display = 'block';
              successDiv.style.display = 'none';
            }
          });
        </script>
      </body>
      </html>
    `;

    res.send(html);
  }
}
