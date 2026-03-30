
@Entity
@Table(name="endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="email")
    private String email;

    @Column(name="nome_completo")
    private String nome_completo;

    @Column(name="plano")
    private String plano;

    @Column(name="data_nascimento")
    private String data_nascimento;
