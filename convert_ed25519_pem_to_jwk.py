# Requiere: pip install jwcrypto cryptography
from jwcrypto import jwk
from cryptography.hazmat.primitives import serialization

# Lee la clave pública PEM
with open("public.key", "rb") as f:
    public_pem = f.read()

# Carga la clave pública Ed25519
public_key = serialization.load_pem_public_key(public_pem)

# Exporta la clave pública a JWK
jwk_key = jwk.JWK.from_pyca(public_key)
print(jwk_key.export(private_key=False, as_dict=False))
