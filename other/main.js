// methods 

// const { equalText } = require("mathjs");
// const { abs } = require("mathjs");
// const { re } = require("mathjs");

// eigenstates()
// full()
// ptrace(0)
// ptrace(1)

function conj(M){// take the conjugate of a matrix
   let m = math.size(M)._data[0]; let n = math.size(M)._data[1];
   for (var i = 0; i < m; i++) {
        for (var j = 0; j < n; j++){
            M._data[i][j] =M._data[i][j].conjugate();
        }
   }
   return M;
}

function dag(M) {// return the dagger of the matrix M
    return math.transpose(conj(matrix));
} 

// trace: use math.trace()

function tensor(A, B){
        let am = math.size(A)._data[0]; let an = math.size(A)._data[1];
        let bm = math.size(B)._data[0]; let bn = math.size(B)._data[1];
        let M = math.zeros(am*bm, an*bn);
        for (var ai = 0; ai < am; ai++) for (var aj = 0; aj < an; aj++)
        for (var bi = 0; bi < bm; bi++) for (var bj = 0; bj < bn; bj++){
                M._data[ai*am+bi][aj*an+bj] =A._data[ai][aj]*B._data[bi][bj];
        }
        return M;
}

function ptrace(M,p){
        let m = math.size(M)._data[0]; let n = math.size(M)._data[1];
        let N = math.zeros(m/2, n/2);
        if(p==0) for (var i = 0; i < m/2; i++) for (var j = 0; j < n/2; j++){
            N._data[i][j] = M._data[i*2][j*2] + M._data[i*2+1][j*2+1]
        }
        if(p==1) for (var i = 0; i < m/2; i++) for (var j = 0; j < n/2; j++){
            N._data[i][j] = M._data[i*2][j*2] + M._data[i][j]
        }
        return N;
}

function dm_arguments(Q) { 
        // input Q is a Qobj representing a density matrix(dm) for a single qubit
        // here we omit the case where the elements in the dm could be complex
        // find p0, p1 and theta for a qubit 
        // p0, p1 are eigenvalues for the 2x2 matrix representation for a qubit
        // p0, p1 are the prob of orthogonal outcomes measuring along the eigen vector
        // retunrns radius r, theta, azimuthal angle phi (angles in radians)
        let aa = Q._data[0][0];
        let bb = Q._data[1][1];
        let adj = Math.abs(bb-aa)/2;
        let opp = Q._data[1][1];
        let r = math.sqrt( Math.pow(adj,2) + Math.pow(opp,2) );
        let theta = Math.asin(opp/r);
        return [r, theta];
}

function rotate(Q, theta){
    // rotates a state on the Bloch sphere clockwise by theta degrees 
    // Q is the Qbj density matrix representation of the state 
    let half_t = theta/2;
    let R = math.matrix([[Math.cos(half_t), -Math.sin(half_t)], [Math.sin(half_t), Math.cos(half_t)]]); //rotation operator
    return math.multiply(R,Q, math.transpose(R));
}
    
function make_dm(r, theta){
        let p0 = 0.5 + r;
        let p1 = 0.5 - r;
        let Q = math.matrix([[p0,0],[0,1]]);
        Q = rotate(Q, theta);
        return Q;
}


function show(M){
   let m = math.size(M)._data[0];
   let n = math.size(M)._data[1];
   for (var i = 0; i < m; i++) {
        s = ''
        for (var j = 0; j < n; j++){
            let a = M._data[i][j];
            if (a.im <0) s = s + a.re.toString() + a.im.toString() + 'i ';
            else {s = s + a.re.toString() + '+' + a.im.toString() + 'i ';}
        }
        console.log(s)
   }
}


function Qobj(L){
  // a matrix wrapper
  return math.matrix(L);
}

const a = math.complex(2, 3);     // Complex 2 + 3i
const b = math.complex(1, 3);    // Complex 1 + 3i

var matrix = math.matrix([[a, b]]); // Matrix
var m = dag(matrix);

var A = math.matrix([[1,0],[0,1]]);
var B = math.matrix([[1,2],[3,4]]);
var C = tensor(A, B);
console.log(C)



var uuState = [0,0,0];// up up 
var udState = [0,0,Math.PI];// up down 
var duState = [0,Math.PI,0];// down up
var ddState = [0,Math.PI,Math.PI];// down down 

var r, t1, t2; 
r, t1, t2 = uuState;

firstQ  = dm_2Q(r,t1,t2);

r, t1, t2 = udState;
secondQ = dm_2Q(r,t1,t2);

console.log(firstQ);
console.log(secondQ);

function dm_2Q(r, t1, t2){
    //     Returns the density matrix representation 2 qubit system given ket params t1, t2, r. 
    //     t1 and t2 are the angles of the 2 qubits on the bloch circle. 
    //     r is their radius on the block circle. 
    q1 = Qobj([[0.5 + r,0],[0, 0.5 - r]])
    q1 = rotate(q1, t1)
    q2 = Qobj([[0.5 + r,0],[0, 0.5 - r]])
    q2 = rotate(q2, t2)
    return tensor(q1, q2)
}

function dm_arguments_2q(Q){
// Extracts r, t1, t2 given Q, a 4x4 density matrix Qobj representing a 2 qubit pure state

//the composite states
    q0 = ptrace(0, 1)
    q1 = ptrace(Q, 1)    
    r, t1 = dm_arguments(q0)
    r, t2 = dm_arguments(q1)
    return r, (t1+Math.pi*2)%(Math.pi*2), (t2+Math.pi*2)%(Math.pi*2)
}




















//Pure Cases 

//Given (x,y) --> convert to polar, extract x,y,theta,a,b,alpha,beta,gamma

function convert(x,y){
        var alpha = math.atan(x/y)
        if (y > 0){
            var theta = alpha
        } 
        else if (y < 0){
            var theta = -(math.sign(alpha)) * math.pi + alpha
        }
    
        var a = math.cos(theta/2);
        var b = math.sin(theta/2);
    
        //var rho = math.matrix([math.pow(a,2), a*b], [a*b, math.pow(b,2)]);
    
        //Mixed 
        var r = math.pow((math.pow(x,2) + math.pow(y,2)), 0.5);
    
        var alpha2 = 0.5 + (r*math.cos(theta));
        var gamma = r*math.sin(theta);
        var beta = 1 - alpha2
    
        return (x, y, theta, r, a, b, alpha2, beta, gamma);
    }

// class Point {
//         constructor(x, y) {
//           this.x = x;
//           this.y = y;
//         }
      
//         static distance(a, b) {
//           const dx = a.x - b.x;
//           const dy = a.y - b.y;
//           return Math.hypot(dx, dy);
//         }
// }
      
// const p1 = new Point(5, 5);
// const p2 = new Point(10, 10);
// p1.distance; //undefined
// p2.distance; //undefined

// console.log(Point.distance(p1, p2)); // 7.0710678118654755


// class Qobj {
//     constructor(ket) {
//       this.ket = ket;
//       this.dm = dm;
//     }
// }


// Qutip 

/*
attribute 
Qobj constructor 


*/

// plot single qubit state 
// plot circle 
// going from state a,b, to r,t (theta)
// going from r, t to a, b

// plot two qubit torus 
// going from state a,c,d,b to r, t1, t2 
        // for r = 0, k = 0.5 , infinitly many sol 
        // for r = 0.5, k = 0 , one sol 
        // for 0 < r < 0.5, 0.5 > k > 0, two sols  

// going from state r, t1, t2 to a,c,d,b => should find one answer


// def vectToDensityMatrix(Q): 
// class SingleQubit(){
//     constructor(ket) {
//         this.ket = ket;
//         this.dm = dm;
//     }

//     constructor(dm) {
//         this.ket = ket;
//         this.dm = dm;
//     }

// }

// const q = new SingleQubit(); // ReferenceError
