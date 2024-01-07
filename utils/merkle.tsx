
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';

interface Proof {
  address: string;
  proof: string[];
  token: string;
}

interface OutputData {
  rootHash: string;
  proofs: Proof[];
}

export const generateMerkleTreeServerSide = async (
  jsonData: any[],
  progressCallback: (progress: number) => void
): Promise<OutputData> => {
  try {
    const inputAddresses = jsonData.map(({ address, token }: { address: string; token: number }) => {
      return { address, token: Math.floor(Number(token)).toString() };
    });

    const inputLeafNodes = inputAddresses.map((arr) =>
      ethers.utils.solidityKeccak256(['address', 'uint256'], [arr.address, arr.token])
    );

    const inputMerkleTree = new MerkleTree(inputLeafNodes, (data: any) => ethers.utils.keccak256(data), {
      sortPairs: true,
    });
    const inputRootHash = inputMerkleTree.getHexRoot();

    const inputProofs = inputAddresses.map((arr, index) => {
      const proof = inputMerkleTree.getHexProof(inputLeafNodes[index]);

      const progress = ((index + 1) / inputAddresses.length) * 100;
   //   console.log(`Progress: ${progress}%`); 
      
      progressCallback(progress);

      return { address: arr.address, proof, token: arr.token };
    });

    return {
      rootHash: inputRootHash,
      proofs: inputProofs,
    };
  } catch (error: any) {
    throw new Error(`Error generating Merkle Tree: ${error.message}`);
  }
};
